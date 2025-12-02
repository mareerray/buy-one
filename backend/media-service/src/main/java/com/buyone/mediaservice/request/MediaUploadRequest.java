package com.buyone.mediaservice.request;

import lombok.*;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaUploadRequest {
    
    @NotBlank(message = "Product ID is required")
    private String productId;
    
}
