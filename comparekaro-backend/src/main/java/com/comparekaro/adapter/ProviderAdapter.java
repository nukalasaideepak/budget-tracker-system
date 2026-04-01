package com.comparekaro.adapter;

import com.comparekaro.model.PriceResult;
import com.comparekaro.model.SearchRequest;

public interface ProviderAdapter {
    PriceResult fetchPrice(SearchRequest request);
    String getProviderName();
    String getDomainName();
}
