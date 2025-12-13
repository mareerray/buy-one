package com.buyone.mediaservice.service.impl;
import com.buyone.mediaservice.model.Media;
import com.buyone.mediaservice.model.MediaOwnerType;
import com.buyone.mediaservice.repository.MediaRepository;
import com.buyone.mediaservice.response.MediaResponse;
import com.buyone.mediaservice.response.DeleteMediaResponse;
import com.buyone.mediaservice.service.MediaService;
import com.buyone.mediaservice.service.StorageService;
import com.buyone.mediaservice.exception.MediaNotFoundException;
import com.buyone.mediaservice.exception.InvalidFileException;
import com.buyone.mediaservice.exception.ConflictException;
import com.buyone.mediaservice.exception.ForbiddenException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {
    
    private final MediaRepository mediaRepository;
    private final StorageService storageService;
    
    private static final int MAX_IMAGES_PER_PRODUCT = 5;
    private static final long MAX_FILE_SIZE_BYTES = 2L * 1024 * 1024;

    @Value("${app.media.public-base-url}")
    private String publicBucketBaseUrl;
    
    @Override
    public MediaResponse uploadImage(MultipartFile file,
                                    String ownerId,
                                    MediaOwnerType ownerType,
                                    String currentUserId,
                                    String currentUserRole) {
        validateImageFile(file);
        if (!"SELLER".equals(currentUserRole)) {
            throw new ForbiddenException("Only Seller can upload images");
        }
        if (ownerType == MediaOwnerType.USER && !ownerId.equals(currentUserId)) {
            throw new ForbiddenException("You can only upload an avatar for yourself.");
        }

        // If this is a product image, enforce max 5 images per product
        if (ownerType == MediaOwnerType.PRODUCT) {
            long imageCount = mediaRepository.countByOwnerIdAndOwnerType(ownerId, MediaOwnerType.PRODUCT);
            if (imageCount >= MAX_IMAGES_PER_PRODUCT) {
                throw new ConflictException("This product already has the maximum number of images (" + MAX_IMAGES_PER_PRODUCT + ").");
            }
        }
        
        Media media = Media.builder()
                .ownerId(ownerId)
                .ownerType(ownerType)
                .createdAt(Instant.now())
                .build();
        
        media = mediaRepository.save(media);
        
        // store() should return something like "media/<id>.png"
        String imagePath = storageService.store(file, media.getId());
        
        media.setImagePath(imagePath);
        media = mediaRepository.save(media);
        
        // Public Cloudflare URL, e.g. https://pub-....r2.dev/media/<id>.png
        String url = publicBucketBaseUrl + "/" + imagePath;
        
        return new MediaResponse(
                media.getId(),
                media.getOwnerId(),
                url,
                media.getCreatedAt()
        );
    }
    
    @Override
    public MediaResponse getMedia(String id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new MediaNotFoundException(id));
        // Public Cloudflare URL, e.g. https://pub-....r2.dev/media/<id>.png
        String url = publicBucketBaseUrl + "/" + media.getImagePath();
        return new MediaResponse(
                media.getId(),
                media.getOwnerId(),
                url,
                media.getCreatedAt()
        );
    }
    
    @Override
    public MediaResponse updateMedia(MultipartFile file,
                                    String mediaId,
                                    String currentUserId,
                                    String currentUserRole) {
        validateImageFile(file);
        
        if (!"SELLER".equals(currentUserRole)) {
            throw new ForbiddenException("Only sellers can update images.");
        }
        
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new MediaNotFoundException(mediaId));
        
        // Ownership: only ownerId can update this media
        if (!media.getOwnerId().equals(currentUserId)) {
            throw new ForbiddenException("You can only update your own media.");
        }
        
        
        storageService.delete(media.getImagePath());
        
        String newImagePath = storageService.store(file, media.getId());
        
        media.setImagePath(newImagePath);
        media.setCreatedAt(Instant.now());
        
        media = mediaRepository.save(media);
        
        // Public Cloudflare URL, e.g. https://pub-....r2.dev/media/<id>.png
        String url = publicBucketBaseUrl + "/" + newImagePath;
        
        return new MediaResponse(
                media.getId(),
                media.getOwnerId(),
                url,
                media.getCreatedAt()
        );
    }
    
    @Override
    public DeleteMediaResponse deleteMedia(String id,
                                        String currentUserId,
                                        String currentUserRole) {
        
        if (!"SELLER".equals(currentUserRole)) {
            throw new ForbiddenException("Only sellers can delete images.");
        }
        
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new MediaNotFoundException(id));

        // If this is a user avatar, ownerId must equal currentUserId
        if (media.getOwnerType() == MediaOwnerType.USER) {
            if (!media.getOwnerId().equals(currentUserId)) {
                throw new ForbiddenException("You can only delete your own avatar.");
            }
        }
        
        // Ownership: only ownerId can delete this media
        if (media.getOwnerType() == MediaOwnerType.PRODUCT) {
            // For now, just allow delete for SELLER role (already checked above)
        }
        
        storageService.delete(media.getImagePath());
        mediaRepository.deleteById(id);
        return new DeleteMediaResponse(id, "Deleted successfully");
    }
    
    @Override
    public List<MediaResponse> mediaListForProduct(String productId) {
        var medias = mediaRepository.findAllByOwnerIdAndOwnerType(productId, MediaOwnerType.PRODUCT);
        
        return medias.stream()
                .map(m -> new MediaResponse(
                        m.getId(),
                        m.getOwnerId(),
                        publicBucketBaseUrl + "/" + m.getImagePath(),
                        m.getCreatedAt()
                ))
                .toList();
    }
    
    @Override
    public Media findMediaEntity(String id) {
        return mediaRepository.findById(id)
                .orElseThrow(() -> new MediaNotFoundException(id));
    }
    
    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("No file provided!");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new InvalidFileException("File exceeds 2MB size limit!");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new InvalidFileException("Only image files are allowed!");
        }
    }
    
}
