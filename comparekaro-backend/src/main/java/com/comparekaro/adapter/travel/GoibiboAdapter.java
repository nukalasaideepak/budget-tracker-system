package com.comparekaro.adapter.travel;

import com.comparekaro.adapter.ProviderAdapter;
import com.comparekaro.model.PriceResult;
import com.comparekaro.model.SearchRequest;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class GoibiboAdapter implements ProviderAdapter {

    @Override
    public PriceResult fetchPrice(SearchRequest request) {
        PriceResult result = new PriceResult();
        result.setProviderName(getProviderName());
        result.setDomainName(getDomainName());
        result.setPrice(randomPrice(2200, 14000));
        result.setEta(randomInt(1, 4) + "h " + randomInt(10, 55) + "m");
        result.setRating(4.2);
        result.setLogoUrl("https://logo.clearbit.com/goibibo.com");
        result.setBaseUrl("https://www.goibibo.com");
        result.setTagline("Smart way to travel");
        result.setMetadata(Map.of(
            "class", "Economy",
            "stops", randomInt(0, 2) == 0 ? "Non-stop" : randomInt(1, 2) + " stop(s)",
            "airline", randomAirline()
        ));
        return result;
    }

    @Override
    public String getProviderName() { return "Goibibo"; }

    @Override
    public String getDomainName() { return "Travel"; }

    private String randomAirline() {
        String[] airlines = {"IndiGo", "Air India", "SpiceJet", "Vistara", "AirAsia"};
        return airlines[ThreadLocalRandom.current().nextInt(airlines.length)];
    }

    private double randomPrice(double min, double max) {
        return Math.round(ThreadLocalRandom.current().nextDouble(min, max) * 100.0) / 100.0;
    }

    private int randomInt(int min, int max) {
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }
}
