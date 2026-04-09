package com.example.mileStone1.adapter;

import com.example.mileStone1.model.PriceResult;
import com.example.mileStone1.model.SearchRequest;
import java.util.List;

public interface ProviderAdapter {
    List<PriceResult> fetchPrice(SearchRequest request);
    String getProviderName();
    String getDomainName();
}
