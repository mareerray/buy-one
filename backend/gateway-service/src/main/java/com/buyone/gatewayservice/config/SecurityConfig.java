package com.buyone.gatewayservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .authorizeExchange(exchanges -> exchanges
                    .pathMatchers("/auth/**").permitAll()   // allow login/register
                    .pathMatchers(HttpMethod.GET, "/products/**").permitAll()  // public GET
                    .pathMatchers("/products/**").authenticated()
                    .pathMatchers(HttpMethod.GET, "/media/images/**").permitAll()
                    .anyExchange().authenticated()          // require JWT for all others
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                    .jwt() // Spring Security will validate JWT
            );
        return http.build();
    }
}
