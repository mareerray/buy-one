package com.buyone.mediaservice.repository;

import com.buyone.mediaservice.model.Media;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MediaRepository extends MongoRepository<Media, String> {
    List<Media> findAllByProductId(String productId);
    long countByProductId(String productId);
}
