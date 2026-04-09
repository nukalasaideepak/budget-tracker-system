package com.example.mileStone1.adapter.food;

import com.example.mileStone1.adapter.ProviderAdapter;
import com.example.mileStone1.model.PriceResult;
import com.example.mileStone1.model.SearchRequest;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class ZomatoAdapter implements ProviderAdapter {

    @Override
    public PriceResult fetchPrice(SearchRequest request) {
        PriceResult result = new PriceResult();
        result.setProviderName(getProviderName());
        result.setDomainName(getDomainName());
        result.setPrice(randomPrice(140, 580));
        result.setEta(randomInt(25, 50) + " mins");
        result.setRating(4.3);
        result.setLogoUrl("https://logo.clearbit.com/zomato.com");
        result.setBaseUrl("https://www.zomato.com");
        result.setTagline("Better food for more people");
        result.setMetadata(Map.of(
            "deliveryFee", "₹" + randomInt(10, 45),
            "discount", randomInt(1, 4) > 2 ? "Flat ₹75 OFF" : "BOGO Deal",
            "restaurant", request.getQuery() != null ? request.getQuery() : "Top Rated Restaurant"
        ));
        return result;
    }

    @Override
    public String getProviderName() { return "Zomato"; }

    @Override
    public String getDomainName() { return "Food Delivery"; }

    private double randomPrice(double min, double max) {
        return Math.round(ThreadLocalRandom.current().nextDouble(min, max) * 100.0) / 100.0;
    }

    private int randomInt(int min, int max) {
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }
}
