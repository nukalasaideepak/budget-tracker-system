package com.example.mileStone1.adapter;

import com.example.mileStone1.model.PriceResult;
import com.example.mileStone1.model.SearchRequest;

public interface ProviderAdapter {
    PriceResult fetchPrice(SearchRequest request);
    String getProviderName();
    String getDomainName();
}
