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
        // You may want to check for duplicate storage here if needed—throw ConflictException
        
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
        // Optionally: check ownership (seller can only modify own images)
        
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
    public void deleteMedia(String id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new MediaNotFoundException(id));
        // Optionally, check authorization (ownership)
        storageService.delete(media.getImagePath());
        mediaRepository.deleteById(id);
    }
}
