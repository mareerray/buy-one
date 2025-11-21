package com.buyone.productservice.controller;

import com.buyone.productservice.request.CreateProductRequest;
import com.buyone.productservice.request.UpdateProductRequest;
import com.buyone.productservice.response.ProductResponse;
import com.buyone.productservice.response.ApiResponse;
import com.buyone.productservice.exception.ForbiddenException;
import com.buyone.productservice.service.ProductService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import jakarta.validation.*;
import java.util.List;

@RestController
@RequestMapping("/products")
@Validated // For request validation (if using method-level validation later)
public class ProductController {
    
    private final ProductService productService;
    
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    
    // GET /products (public)
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
    
    // GET /products/{id} (public)
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable String id) {
        ProductResponse product = productService.getProductById(id)
                .orElseThrow(); // Relies on service to throw if not found
        return ResponseEntity.ok(product);
    }
    
    // POST /products (seller only)
    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @Valid @RequestBody CreateProductRequest request,
            @RequestHeader("X-USER-ID") String sellerId,
            @RequestHeader("X-USER-ROLE") String role
    ) {
        if (!"SELLER".equals(role)) {
            throw new ForbiddenException("Only sellers can create products.");
        }
        ProductResponse product = productService.createProduct(request, sellerId);
        
        ApiResponse<ProductResponse> response = ApiResponse.<ProductResponse>builder()
                .success(true)
                .message("Product created successfully")
                .data(product)
                .build();
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    // PUT /products/{id} (seller only & must own)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody UpdateProductRequest request,
            @RequestHeader("X-USER-ID") String sellerId,
            @RequestHeader("X-USER-ROLE") String role
    ) {
        if (!"SELLER".equals(role)) {
            throw new ForbiddenException("Only sellers can update products.");
        }
        ProductResponse product = productService.updateProduct(id, request, sellerId);
        ApiResponse<ProductResponse> response = ApiResponse.<ProductResponse>builder()
                .success(true)
                .message("Product updated successfully")
                .data(product)
                .build();
        return ResponseEntity.ok(response);
    }
    
    // DELETE /products/{id} (seller only & must own)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @PathVariable String id,
            @RequestHeader("X-USER-ID") String sellerId,
            @RequestHeader("X-USER-ROLE") String role
    ) {
        if (!"SELLER".equals(role)) {
            throw new ForbiddenException("Only sellers can delete products.");
        }
        productService.deleteProduct(id, sellerId);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Product deleted successfully")
                .build();
        return ResponseEntity.ok(response);
    }
}
