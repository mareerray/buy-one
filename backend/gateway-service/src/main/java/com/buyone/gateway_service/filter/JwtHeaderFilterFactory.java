package com.buyone.gateway_service.filter;

import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationToken;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class JwtHeaderFilterFactory extends AbstractGatewayFilterFactory<JwtHeaderFilterFactory.Config> {
    
    public JwtHeaderFilterFactory() {
        super(Config.class);
    }
    
    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) ->
                exchange.getPrincipal()
                        .cast(ReactiveJwtAuthenticationToken.class)
                        .map(auth -> {
                            Jwt jwt = auth.getToken();
                            String userId = jwt.getSubject();
                            String role = jwt.getClaimAsString("role");
                            ServerHttpRequest request = exchange.getRequest()
                                    .mutate()
                                    .header("X-USER-ID", userId)
                                    .header("X-USER-ROLE", role)
                                    .build();
                            return exchange.mutate().request(request).build();
                        })
                        .defaultIfEmpty(exchange)
                        .flatMap(chain::filter);
    }
    
    public static class Config {} // no custom config
}
