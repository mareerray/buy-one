package com.buyone.productservice.service;

import com.buyone.productservice.model.Product;
import com.buyone.productservice.repository.ProductRepository;
import com.buyone.productservice.request.CreateProductRequest;
import com.buyone.productservice.request.UpdateProductRequest;
import com.buyone.productservice.response.ProductResponse;
import com.buyone.productservice.exception.ProductNotFoundException;
import com.buyone.productservice.exception.ForbiddenException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {
    
    private final ProductRepository productRepository;
    
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    // Create Product (seller only, enforce at controller)
    @Override
    public ProductResponse createProduct(CreateProductRequest request, String sellerId) {
        // BUSINESS RULE:
        // Only seller can create - enforced at controller/gateway using JWT.
        // Example for business validation:
        if (request.getPrice() != null && request.getPrice() < 0) {
            throw new BadRequestException("Price must be non-negative.");
        }
        if (request.getQuantity() != null && request.getQuantity() < 0) {
            throw new BadRequestException("Quantity must be zero or greater.");
        }
        
        // Example conflict check (duplicate product name for seller)
        List<Product> existing = productRepository.findByUserId(sellerId)
                .stream()
                .filter(p -> p.getName().equalsIgnoreCase(request.getName()))
                .collect(Collectors.toList());
        if (!existing.isEmpty()) {
            throw new ConflictException("Product with name already exists for seller.");
        }
        
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .userId(sellerId)
                .build();
        
        Product savedProduct = productRepository.save(product);
        return toProductResponse(savedProduct);
    }
    
    // Get single product by ID
    @Override
    public Optional<ProductResponse> getProductById(String id) {
        return productRepository.findById(id)
                .map(this::toProductResponse)
                .or(() -> {
                    throw new ProductNotFoundException("Product not found with ID: " + id);
                });
    }
    
    // Get all products (consider pagination for production)
    // consider Pagination. (page,size) to reduce a massive call as this scales.
    @Override
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();
        if (products.isEmpty()) {
            throw new ProductNotFoundException("No products found.");
        }
        return products.stream()
                .map(this::toProductResponse)
                .collect(Collectors.toList());
    }
    
    // Update product (seller only)
    @Override
    public ProductResponse updateProduct(String id, UpdateProductRequest request, String sellerId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Cannot update — Product not found with ID: " + id));
        // BUSINESS RULE:
        // Only owner (seller) can update this product
        if (!product.getUserId().equals(sellerId)) {
            throw new ForbiddenException("Unauthorized: You do not own this product");
        }
        
        // Validate business logic on incoming changes
        if (request.getPrice() != null && request.getPrice() < 0) {
            throw new BadRequestException("Price must be non-negative.");
        }
        if (request.getQuantity() != null && request.getQuantity() < 0) {
            throw new BadRequestException("Quantity must be zero or greater.");
        }
        
        // Prevent changing to a name that already exists for same seller (conflict)
        if (request.getName() != null && !request.getName().equals(product.getName())) {
            List<Product> existing = productRepository.findByUserId(sellerId)
                    .stream()
                    .filter(p -> p.getName().equalsIgnoreCase(request.getName()) && !p.getId().equals(product.getId()))
                    .collect(Collectors.toList());
            if (!existing.isEmpty()) {
                throw new ConflictException("Product with name already exists for seller.");
            }
        }
        
        // Update fields if provided
        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getQuantity() != null) product.setQuantity(request.getQuantity());
        
        Product updatedProduct = productRepository.save(product);
        return toProductResponse(updatedProduct);
    }
    
    // Delete product (seller only)
    @Override
    @Transactional
    public void deleteProduct(String id, String sellerId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Cannot delete — Product not found with ID: " + id));
        // BUSINESS RULE:
        // Only owner (seller) can delete this product
        if (!product.getUserId().equals(sellerId)) {
            throw new ForbiddenException("Unauthorized: You do not own this product");
        }
        productRepository.deleteById(id);
    }
    
    // Get all products by seller (for seller dashboard)
    @Override
    public List<ProductResponse> getProductsBySeller(String sellerId) {
        List<Product> products = productRepository.findByUserId(sellerId);
        if (products.isEmpty()) {
            throw new ProductNotFoundException("No products found for seller: " + sellerId);
        }
        return products.stream().map(this::toProductResponse).collect(Collectors.toList());
    }
    
    // Helper: Map Product entity to ProductResponse DTO
    private ProductResponse toProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .userId(product.getUserId()) // Correct getter
                .build();
    }
}
