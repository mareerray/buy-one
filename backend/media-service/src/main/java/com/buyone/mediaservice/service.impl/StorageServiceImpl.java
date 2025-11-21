package com.buyone.mediaservice.service.impl;

import com.buyone.mediaservice.service.StorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class StorageServiceImpl implements StorageService {
    
    private final Path rootLocation;
    
    public StorageServiceImpl(
            @Value("${media.storage.location:media-storage}") String storageLocation
    ) {
        this.rootLocation = Paths.get(storageLocation).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.rootLocation);
        } catch (IOException e) {
            throw new IllegalStateException("Could not create storage directory", e);
        }
    }
    
    @Override
    public String store(MultipartFile file, String mediaId) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file");
        }
        
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        }
        
        String filename = mediaId + extension;
        
        try {
            Path target = rootLocation.resolve(filename).normalize();
            Files.copy(file.getInputStream(), target, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store file", e);
        }
        
        return filename;
    }
    
    @Override
    public Resource loadAsResource(String imagePath) {
        return null;
    }
    
    @Override
    public void delete(String imagePath) {
    }
}
