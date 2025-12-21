package com.conspiracy.forum.config;

import com.conspiracy.forum.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.server.WebGraphQlInterceptor;
import org.springframework.graphql.server.WebGraphQlRequest;
import org.springframework.graphql.server.WebGraphQlResponse;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class GraphQLInterceptor implements WebGraphQlInterceptor {
    private final UserService userService;
    
    @Override
    public Mono<WebGraphQlResponse> intercept(WebGraphQlRequest request, Chain chain) {
        String authHeader = request.getHeaders().getFirst("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Long userId = userService.extractUserIdFromToken(token);
            if (userId != null) {
                request.configureExecutionInput((executionInput, builder) ->
                    builder.graphQLContext(context -> context.put("userId", userId)).build()
                );
            }
        }
        
        return chain.next(request);
    }
}
