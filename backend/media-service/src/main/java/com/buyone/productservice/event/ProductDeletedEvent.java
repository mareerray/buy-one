package com.buyone.productservice.event;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductDeletedEvent {
    private String productId;
    private String sellerId;
}