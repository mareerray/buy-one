package com.buyone.mediaservice.service.impl;

import com.buyone.mediaservice.model.Media;
import com.buyone.mediaservice.repository.MediaRepository;
import com.buyone.mediaservice.response.MediaResponse;
import com.buyone.mediaservice.service.MediaService;
import com.buyone.mediaservice.service.StorageService;
import com.buyone.mediaservice.exception.MediaNotFoundException;
import com.buyone.mediaservice.exception.InvalidFileException;
import com.buyone.mediaservice.exception.ConflictException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {
    
    private final MediaRepository mediaRepository;
    private final StorageService storageService;
    
    private static final int MAX_IMAGES_PER_PRODUCT = 5;
    
    @Override
    public MediaResponse uploadImage(MultipartFile file, String productId) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("No file provided!");
        }
        if (file.getSize() > 2 * 1024 * 1024) {
            throw new InvalidFileException("File exceeds 2MB size limit!");
        }
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new InvalidFileException("Only image files are allowed!");
        }
        
        long imageCount = mediaRepository.countByProductId(productId);
        if (imageCount >= MAX_IMAGES_PER_PRODUCT) {
            throw new ConflictException("This product already has the maximum number of images (" + MAX_IMAGES_PER_PRODUCT + ").");
        }
        
        Media media = Media.builder()
                .productId(productId)
                .createdAt(Instant.now())
                .build();
        
        media = mediaRepository.save(media);
        
        String imagePath = storageService.store(file, media.getId());
        
        media.setImagePath(imagePath);
        media = mediaRepository.save(media);
        
        String url = "/media/images/" + media.getId();
        
        return new MediaResponse(
                media.getId(),
                media.getProductId(),
                url,
                media.getCreatedAt()
        );
    }
    
    @Override
    public MediaResponse getMedia(String id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new MediaNotFoundException(id));
        String url = "/media/images/" + media.getId();
        return new MediaResponse(media.getId(), media.getProductId(), url, media.getCreatedAt());
    }
    
    @Override
    public MediaResponse updateMedia(MultipartFile file, String mediaId) {
        // Validate file
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("No file provided!");
        }
        if (file.getSize() > 2 * 1024 * 1024) {
            throw new InvalidFileException("File exceeds 2MB size limit!");
        }
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new InvalidFileException("Only image files are allowed!");
        }
        
        // Find the existing Media entity
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new MediaNotFoundException(mediaId));
        // Optionally: check productId matches (to prevent mix-ups)
        if (!media.getProductId().equals(expectedProductId)) {
            throw new ForbiddenException("This media does not belong to the specified product.");
        }
        // Optionally: check ownership (seller can only modify own images)
        // Suppose you pass or inject currentUserId somehow
        if (!currentUserId.equals(ownerUserId)) {
            throw new ForbiddenException("You do not have permission to modify this media.");
        }
        
        
        // Delete old file
        storageService.delete(media.getImagePath());
        
        // Store new file
        String newImagePath = storageService.store(file, media.getId());
        
        // Update media metadata
        media.setImagePath(newImagePath);
        media.setCreatedAt(Instant.now()); // if you want to track updates
        
        media = mediaRepository.save(media);
        
        String url = "/media/images/" + media.getId();
        
        return new MediaResponse(media.getId(), media.getProductId(), url, media.getCreatedAt());
    }
    
    @Override
    public DeleteMediaResponse deleteMedia(String id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new MediaNotFoundException(id));
        storageService.delete(media.getImagePath());
        mediaRepository.deleteById(id);
        return new DeleteMediaResponse(id, "Deleted successfully");
    }
}
