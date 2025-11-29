package com.buyone.mediaservice.controller;

import com.buyone.mediaservice.response.MediaResponse;
import com.buyone.mediaservice.response.MediaListResponse;
import com.buyone.mediaservice.response.DeleteMediaResponse;
import com.buyone.mediaservice.response.ApiResponse;
import com.buyone.mediaservice.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/media/images")
@RequiredArgsConstructor
public class MediaController {
    
    private final MediaService mediaService;
    // use @Value or service constant and put into yml
    private static final int MAX_IMAGES_PER_PRODUCT = 5;
    
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<MediaListResponse>> listMediaForProduct(@PathVariable String productId) {
        List<MediaResponse> responses = mediaService.mediaListForProduct(productId);
        MediaListResponse payload = new MediaListResponse(responses, responses.size(), MAX_IMAGES_PER_PRODUCT);
        ApiResponse<MediaListResponse> response = ApiResponse.<MediaListResponse>builder()
                .success(true)
                .data(payload)
                .build();
        return ResponseEntity.ok(response);
    }
    
    // get metadata for specific media file
    @GetMapping("/{mediaId}")
    public ResponseEntity<ApiResponse<MediaResponse>> getMedia(@PathVariable String mediaId) {
        MediaResponse media = mediaService.getMedia(mediaId);
        ApiResponse<MediaResponse> response = ApiResponse.<MediaResponse>builder()
                .success(true)
                .data(media)
                .build();
        return ResponseEntity.ok(response);
    }
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<MediaResponse>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("productId") String productId
    ) {
        MediaResponse media = mediaService.uploadImage(file, productId);
        ApiResponse<MediaResponse> response = ApiResponse.<MediaResponse>builder()
                .success(true)
                .message("Image uploaded successfully")
                .data(media)
                .build();
        return ResponseEntity.status(201).body(response);
    }
    
    @PutMapping(value = "/{mediaId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<MediaResponse>> updateMedia(
            @PathVariable String mediaId,
            @RequestParam("file") MultipartFile file
    ) {
        MediaResponse media = mediaService.updateMedia(file, mediaId);
        ApiResponse<MediaResponse> response = ApiResponse.<MediaResponse>builder()
                .success(true)
                .message("Image updated successfully")
                .data(media)
                .build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{mediaId}")
    public ResponseEntity<ApiResponse<DeleteMediaResponse>>  deleteMedia(@PathVariable String mediaId) {
        DeleteMediaResponse deleted = mediaService.deleteMedia(mediaId);
        ApiResponse<DeleteMediaResponse> response = ApiResponse.<DeleteMediaResponse>builder()
                .success(true)
                .message("Deleted successfully")
                .data(deleted)
                .build();
        return ResponseEntity.ok(response);
    }
}
