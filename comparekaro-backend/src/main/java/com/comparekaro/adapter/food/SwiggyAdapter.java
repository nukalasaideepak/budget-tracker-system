package com.comparekaro.adapter.food;

import com.comparekaro.adapter.ProviderAdapter;
import com.comparekaro.model.PriceResult;
import com.comparekaro.model.SearchRequest;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class SwiggyAdapter implements ProviderAdapter {

    @Override
    public PriceResult fetchPrice(SearchRequest request) {
        PriceResult result = new PriceResult();
        result.setProviderName(getProviderName());
        result.setDomainName(getDomainName());
        result.setPrice(randomPrice(150, 600));
        result.setEta(randomInt(20, 45) + " mins");
        result.setRating(4.4);
        result.setLogoUrl("https://logo.clearbit.com/swiggy.com");
        result.setBaseUrl("https://www.swiggy.com");
        result.setTagline("What's on your mind?");
        result.setMetadata(Map.of(
            "deliveryFee", "₹" + randomInt(15, 50),
            "discount", randomInt(1, 5) > 3 ? "20% OFF up to ₹100" : "Free Delivery",
            "restaurant", request.getQuery() != null ? request.getQuery() : "Popular Restaurant"
        ));
        return result;
    }

    @Override
    public String getProviderName() { return "Swiggy"; }

    @Override
    public String getDomainName() { return "Food Delivery"; }

    private double randomPrice(double min, double max) {
        return Math.round(ThreadLocalRandom.current().nextDouble(min, max) * 100.0) / 100.0;
    }

    private int randomInt(int min, int max) {
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }
}
