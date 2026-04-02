package com.example.mileStone1.service;

import com.example.mileStone1.adapter.ProviderAdapter;
import com.example.mileStone1.model.PriceResult;
import com.example.mileStone1.model.SearchRequest;
import org.springframework.stereotype.Service;

import com.example.mileStone1.repository.PriceHistoryRepository;
import com.example.mileStone1.model.PriceHistory;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class ComparisonService {

    private final List<ProviderAdapter> adapters;
    private final PriceHistoryRepository historyRepository;

    public ComparisonService(List<ProviderAdapter> adapters, PriceHistoryRepository historyRepository) {
        this.adapters = adapters;
        this.historyRepository = historyRepository;
    }

    public List<PriceResult> compare(SearchRequest request) {
        List<ProviderAdapter> domainAdapters = adapters.stream()
                .filter(a -> a.getDomainName().equalsIgnoreCase(request.getDomainName()))
                .collect(Collectors.toList());

        List<PriceResult> results = new ArrayList<>();
        for (ProviderAdapter adapter : domainAdapters) {
            try {
                PriceResult result = adapter.fetchPrice(request);
                results.add(result);
                
                // Save current price to history
                String queryKey = request.getQuery() != null ? request.getQuery() : (request.getFrom() + " to " + request.getTo());
                if(queryKey == null || queryKey.isBlank() || queryKey.equals("null to null")) queryKey = "Default";
                
                historyRepository.save(new PriceHistory(
                    request.getDomainName(),
                    result.getProviderName(),
                    queryKey,
                    result.getPrice(),
                    LocalDateTime.now()
                ));

                // Mock past 7 days of data for graph if none exists
                if (historyRepository.findByDomainNameAndQueryOrderByTimestampAsc(request.getDomainName(), queryKey).size() <= 1) {
                    for(int i = 7; i >= 1; i--) {
                        historyRepository.save(new PriceHistory(
                            request.getDomainName(),
                            result.getProviderName(),
                            queryKey,
                            result.getPrice() * (ThreadLocalRandom.current().nextDouble(0.85, 1.15)),
                            LocalDateTime.now().minusDays(i)
                        ));
                    }
                }

            } catch (Exception e) {
                // Log and skip failed adapter
                System.err.println("Failed to fetch from " + adapter.getProviderName() + ": " + e.getMessage());
            }
        }

        // Sort by price ascending
        results.sort(Comparator.comparingDouble(PriceResult::getPrice));

        // Mark best deal (cheapest)
        if (!results.isEmpty()) {
            results.get(0).setBestDeal(true);
        }

        return results;
    }

    public List<PriceHistory> getHistory(String domainName, String query) {
        if(query == null || query.isBlank()) query = "Default";
        return historyRepository.findByDomainNameAndQueryOrderByTimestampAsc(domainName, query);
    }

    public List<String> getAvailableDomains() {
        return adapters.stream()
                .map(ProviderAdapter::getDomainName)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getDomainDetails() {
        Map<String, List<ProviderAdapter>> grouped = adapters.stream()
                .collect(Collectors.groupingBy(ProviderAdapter::getDomainName));

        Map<String, String> icons = Map.of(
            "Transportation", "🚕",
            "Food Delivery", "🍕",
            "Grocery", "🛒",
            "Travel", "✈️"
        );
        Map<String, String> colors = Map.of(
            "Transportation", "#6366f1",
            "Food Delivery", "#f97316",
            "Grocery", "#10b981",
            "Travel", "#3b82f6"
        );
        Map<String, String> descriptions = Map.of(
            "Transportation", "Compare ride fares across Uber, Ola & Rapido — find the cheapest ride instantly",
            "Food Delivery", "Compare food prices, delivery fees & offers from Swiggy and Zomato",
            "Grocery", "Compare grocery prices & delivery times across BigBasket, Blinkit & Zepto",
            "Travel", "Compare flight tickets, travel duration & hotel costs from MakeMyTrip & Goibibo"
        );

        // Define desired order
        List<String> domainOrder = List.of("Transportation", "Food Delivery", "Grocery", "Travel");

        List<Map<String, Object>> domains = new ArrayList<>();

        for (String domainName : domainOrder) {
            List<ProviderAdapter> providers = grouped.get(domainName);
            if (providers == null) continue;

            Map<String, Object> domain = new HashMap<>();
            domain.put("name", domainName);
            domain.put("icon", icons.getOrDefault(domainName, "📦"));
            domain.put("color", colors.getOrDefault(domainName, "#6366f1"));
            domain.put("description", descriptions.getOrDefault(domainName, "Compare prices across providers"));
            domain.put("providerCount", providers.size());
            domain.put("providers", providers.stream()
                    .map(ProviderAdapter::getProviderName)
                    .collect(Collectors.toList()));
            domains.add(domain);
        }

        return domains;
    }
}
