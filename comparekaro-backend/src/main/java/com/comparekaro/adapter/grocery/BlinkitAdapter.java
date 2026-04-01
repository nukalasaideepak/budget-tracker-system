package com.comparekaro.adapter.grocery;

import com.comparekaro.adapter.ProviderAdapter;
import com.comparekaro.model.PriceResult;
import com.comparekaro.model.SearchRequest;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Random;

@Component
public class BlinkitAdapter implements ProviderAdapter {

    private final Random random = new Random();

    @Override
    public PriceResult fetchPrice(SearchRequest request) {
        PriceResult result = new PriceResult();
        result.setProviderName("Blinkit");
        result.setDomainName("Grocery");
        result.setPrice(40 + random.nextInt(25));
        result.setCurrency("INR");
        result.setEta("15 mins");
        result.setRating(4.2);
        result.setLogoUrl("https://logo.clearbit.com/blinkit.com");
        result.setBaseUrl("https://www.blinkit.com");
        result.setTagline("Everything delivered in minutes");
        result.setMetadata(Map.of(
            "deliveryFee", "₹25",
            "deliveryTime", "10–15 mins"
        ));
        return result;
    }

    @Override
    public String getProviderName() { return "Blinkit"; }

    @Override
    public String getDomainName() { return "Grocery"; }
}
