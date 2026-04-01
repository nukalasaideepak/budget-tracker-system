package com.comparekaro.adapter.grocery;

import com.comparekaro.adapter.ProviderAdapter;
import com.comparekaro.model.PriceResult;
import com.comparekaro.model.SearchRequest;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Random;

@Component
public class BigBasketAdapter implements ProviderAdapter {

    private final Random random = new Random();

    @Override
    public PriceResult fetchPrice(SearchRequest request) {
        PriceResult result = new PriceResult();
        result.setProviderName("BigBasket");
        result.setDomainName("Grocery");
        result.setPrice(45 + random.nextInt(30));
        result.setCurrency("INR");
        result.setEta("30 mins");
        result.setRating(4.4);
        result.setLogoUrl("https://logo.clearbit.com/bigbasket.com");
        result.setBaseUrl("https://www.bigbasket.com");
        result.setTagline("India's largest online grocery store");
        result.setMetadata(Map.of(
            "deliveryFee", "FREE above ₹200",
            "deliveryTime", "30 mins"
        ));
        return result;
    }

    @Override
    public String getProviderName() { return "BigBasket"; }

    @Override
    public String getDomainName() { return "Grocery"; }
}
