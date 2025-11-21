package com.buyone.mediaservice.response;

import java.time.Instant;

public record MediaResponse(
        String id,
        String productId,
        String url,          // e.g. /media/images/{id}
        Instant createdAt
) {}
