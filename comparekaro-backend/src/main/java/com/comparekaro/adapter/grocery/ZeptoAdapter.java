package com.comparekaro.adapter.grocery;

import com.comparekaro.adapter.ProviderAdapter;
import com.comparekaro.model.PriceResult;
import com.comparekaro.model.SearchRequest;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Random;

@Component
public class ZeptoAdapter implements ProviderAdapter {

    private final Random random = new Random();

    @Override
    public PriceResult fetchPrice(SearchRequest request) {
        PriceResult result = new PriceResult();
        result.setProviderName("Zepto");
        result.setDomainName("Grocery");
        result.setPrice(38 + random.nextInt(20));
        result.setCurrency("INR");
        result.setEta("10 mins");
        result.setRating(4.3);
        result.setLogoUrl("https://logo.clearbit.com/zeptonow.com");
        result.setBaseUrl("https://www.zeptonow.com");
        result.setTagline("Grocery delivered in 10 minutes");
        result.setMetadata(Map.of(
            "deliveryFee", "FREE above ₹99",
            "deliveryTime", "8–10 mins"
        ));
        return result;
    }

    @Override
    public String getProviderName() { return "Zepto"; }

    @Override
    public String getDomainName() { return "Grocery"; }
}
