package com.comparekaro.adapter.transport;

import com.comparekaro.adapter.ProviderAdapter;
import com.comparekaro.model.PriceResult;
import com.comparekaro.model.SearchRequest;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class RapidoAdapter implements ProviderAdapter {

    @Override
    public PriceResult fetchPrice(SearchRequest request) {
        PriceResult result = new PriceResult();
        result.setProviderName(getProviderName());
        result.setDomainName(getDomainName());
        result.setPrice(randomPrice(60, 250));
        result.setEta(randomInt(2, 8) + " mins");
        result.setRating(4.1);
        result.setLogoUrl("https://logo.clearbit.com/rapido.bike");
        result.setBaseUrl("https://www.rapido.bike");
        result.setTagline("Bike taxi, auto & more");
        result.setMetadata(Map.of(
            "rideType", "Rapido Bike",
            "surge", "None",
            "distance", randomInt(2, 20) + " km"
        ));
        return result;
    }

    @Override
    public String getProviderName() { return "Rapido"; }

    @Override
    public String getDomainName() { return "Transportation"; }

    private double randomPrice(double min, double max) {
        return Math.round(ThreadLocalRandom.current().nextDouble(min, max) * 100.0) / 100.0;
    }

    private int randomInt(int min, int max) {
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }
}
