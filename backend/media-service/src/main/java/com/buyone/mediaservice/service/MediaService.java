package com.buyone.mediaservice.service;

import com.buyone.mediaservice.response.MediaResponse;
import com.buyone.mediaservice.response.MediaListResponse;
import com.buyone.mediaservice.response.DeleteMediaResponse;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface MediaService {
    MediaResponse uploadImage(MultipartFile file, String productId);
    MediaResponse getMedia(String id);
    MediaResponse updateMedia(MultipartFile file, String mediaId);
    DeleteMediaResponse deleteMedia(String id);
    
    List<MediaResponse> mediaListForProduct(String productId);
}