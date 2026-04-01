package com.comparekaro.service;

import com.comparekaro.adapter.ProviderAdapter;
import com.comparekaro.model.PriceResult;
import com.comparekaro.model.SearchRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ComparisonService {

    private final List<ProviderAdapter> adapters;

    public ComparisonService(List<ProviderAdapter> adapters) {
        this.adapters = adapters;
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
