package com.conspiracy.forum.resolver;

import com.conspiracy.forum.entity.User;
import com.conspiracy.forum.exception.UnauthorizedException;
import com.conspiracy.forum.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class UserResolver {

    private final UserService userService;

    @QueryMapping
    public User user(@Argument Long id) {
        return userService.getUserById(id);
    }

    @QueryMapping
    public User me() {
        String username = getAuthenticatedUsername();
        return userService.getUserByUsername(username);
    }

    @MutationMapping
    public User setAnonymousMode(@Argument boolean anonymous) {
        String username = getAuthenticatedUsername();
        return userService.updateAnonymousSetting(username, anonymous);
    }

    private String getAuthenticatedUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() ||
            "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedException("You must be logged in to perform this action");
        }
        return authentication.getName();
    }
}
