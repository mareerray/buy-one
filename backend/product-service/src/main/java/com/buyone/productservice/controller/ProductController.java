package com.buyone.productservice.controller;

import com.buyone.productservice.request.CreateProductRequest;
import com.buyone.productservice.request.UpdateProductRequest;
import com.buyone.productservice.response.ProductResponse;
import com.buyone.productservice.exception.ForbiddenException;
import com.buyone.productservice.service.ProductService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import javax.validation.Valid;
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
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody CreateProductRequest request,
            @RequestHeader("X-USER-ID") String sellerId,
            @RequestHeader("X-USER-ROLE") String role
    ) {
        if (!"SELLER".equals(role)) {
            throw new ForbiddenException("Only sellers can create products.");
        }
        ProductResponse product = productService.createProduct(request, sellerId);
        return ResponseEntity.ok(product);
    }
    
    // PUT /products/{id} (seller only & must own)
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody UpdateProductRequest request,
            @RequestHeader("X-USER-ID") String sellerId,
            @RequestHeader("X-USER-ROLE") String role
    ) {
        if (!"SELLER".equals(role)) {
            throw new ForbiddenException("Only sellers can update products.");
        }
        ProductResponse product = productService.updateProduct(id, request, sellerId);
        return ResponseEntity.ok(product);
    }
    
    // DELETE /products/{id} (seller only & must own)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable String id,
            @RequestHeader("X-USER-ID") String sellerId,
            @RequestHeader("X-USER-ROLE") String role
    ) {
        if (!"SELLER".equals(role)) {
            throw new ForbiddenException("Only sellers can delete products.");
        }
        productService.deleteProduct(id, sellerId);
        return ResponseEntity.noContent().build();
    }
}
