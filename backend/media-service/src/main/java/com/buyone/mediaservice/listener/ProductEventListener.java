package com.buyone.mediaservice.listener;

import com.buyone.mediaservice.repository.MediaRepository;
import com.buyone.mediaservice.service.StorageService;
import com.buyone.productservice.event.ProductDeletedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductEventListener {
    
    @Autowired
    private final MediaRepository mediaRepository;
    @Autowired
    private final StorageService storageService;
    
    @KafkaListener(topics = "product-events", groupId = "media-service")
    public void onProductDeleted(ProductDeletedEvent event) {
        // Find all media for this product
        var medias = mediaRepository.findAllByProductId(event.getProductId());
        for (var media : medias) {
            storageService.delete(media.getImagePath());
            mediaRepository.deleteById(media.getId());
        }
        // Optional: log or produce audit event
    }
}
