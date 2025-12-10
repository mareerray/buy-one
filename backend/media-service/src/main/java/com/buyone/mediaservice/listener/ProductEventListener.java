package com.buyone.mediaservice.listener;

import com.buyone.mediaservice.model.MediaOwnerType;
import com.buyone.mediaservice.repository.MediaRepository;
import com.buyone.mediaservice.service.StorageService;
import com.buyone.productservice.event.ProductDeletedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("kafka")
@RequiredArgsConstructor
public class ProductEventListener {
    
    private final MediaRepository mediaRepository;
    private final StorageService storageService;
    
    @KafkaListener(
            topics = "${app.kafka.topic.product-deleted}",
            groupId = "media-service"
    )
    public void onProductDeleted(ProductDeletedEvent event) {
        // Find all media for this product
        var medias = mediaRepository.findAllByOwnerIdAndOwnerType(
                event.getProductId(),
                MediaOwnerType.PRODUCT
        );
        for (var media : medias) {
            storageService.delete(media.getImagePath());
            mediaRepository.deleteById(media.getId());
        }
        // Optional: log or produce audit event
    }
}
