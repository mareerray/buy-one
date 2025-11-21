package com.buyone.mediaservice.service.impl;

import com.buyone.mediaservice.model.Media;
import com.buyone.mediaservice.repository.MediaRepository;
import com.buyone.mediaservice.response.MediaResponse;
import com.buyone.mediaservice.service.MediaService;
import com.buyone.mediaservice.service.StorageService;
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
        // 1. Create initial Media entity
        Media media = Media.builder()
                .productId(productId)
                .createdAt(Instant.now())
                .build();
        
        // 2. Save to get an ID
        media = mediaRepository.save(media);
        
        // 3. Store the file
        String imagePath = storageService.store(file, media.getId());
        
        // 4. Update entity with imagePath and save again
        media.setImagePath(imagePath);
        media = mediaRepository.save(media);
        
        // 5. Build URL for client
        String url = "/media/images/" + media.getId();
        
        // 6. Return response DTO
        return new MediaResponse(
                media.getId(),
                media.getProductId(),
                url,
                media.getCreatedAt()
        );
    }

    
    @Override
    public MediaResponse getMedia(String id) {
        return null;
    }
    
    @Override
    public void deleteMedia(String id) {
    }
}
