package com.buyone.mediaservice.service;

import com.buyone.mediaservice.response.MediaResponse;
import org.springframework.web.multipart.MultipartFile;

public interface MediaService {
    MediaResponse uploadImage(MultipartFile file, String productId);
    MediaResponse getMedia(String id);
    MediaResponse updateMedia(MultipartFile file, String mediaId);
    void deleteMedia(String id);
}