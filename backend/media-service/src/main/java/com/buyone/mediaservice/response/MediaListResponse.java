package com.buyone.mediaservice.response;

public record MediaListResponse(List<MediaResponse> images, int count, int maxImages) {}

