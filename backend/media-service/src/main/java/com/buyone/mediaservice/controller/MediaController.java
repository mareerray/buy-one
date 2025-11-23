package com.buyone.mediaservice.controller;

import com.buyone.mediaservice.response.MediaResponse;
import com.buyone.mediaservice.response.MediaListResponse;
import com.buyone.mediaservice.response.DeleteMediaResponse;
import com.buyone.mediaservice.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/media/images")
@RequiredArgsConstructor
public class MediaController {
    
    private final MediaService mediaService;
    // use @Value or service constant and put into yml
    private static final int MAX_IMAGES_PER_PRODUCT = 5;
    
    @GetMapping("/product/{productId}")
    public MediaListResponse listMediaForProduct(@PathVariable String productId) {
        List<MediaResponse> responses = mediaService.mediaListForProduct(productId);
        return new MediaListResponse(responses, responses.size(), MAX_IMAGES_PER_PRODUCT);
    }
    // get metadata for specific media file
    @GetMapping("/{mediaId}")
    public MediaResponse getMedia(@PathVariable String mediaId) {
        return mediaService.getMedia(mediaId);
    }
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public MediaResponse uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("productId") String productId
    ) {
        return mediaService.uploadImage(file, productId);
    }
    
    @PutMapping(value = "/{mediaId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public MediaResponse updateMedia(
            @PathVariable String mediaId,
            @RequestParam("file") MultipartFile file
    ) {
        return mediaService.updateMedia(file, mediaId);
    }

    @DeleteMapping("/{mediaId}")
    public DeleteMediaResponse deleteMedia(@PathVariable String mediaId) {
        return mediaService.deleteMedia(mediaId);
    }
}
