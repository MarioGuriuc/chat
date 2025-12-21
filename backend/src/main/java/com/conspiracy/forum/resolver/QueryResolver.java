package com.conspiracy.forum.resolver;

import com.conspiracy.forum.dto.AuthPayload;
import com.conspiracy.forum.dto.TheoryPage;
import com.conspiracy.forum.model.Theory;
import com.conspiracy.forum.model.TheoryStatus;
import com.conspiracy.forum.model.User;
import com.conspiracy.forum.service.TheoryService;
import com.conspiracy.forum.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.ContextValue;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class QueryResolver {
    private final TheoryService theoryService;
    private final UserService userService;
    
    @QueryMapping
    public TheoryPage theories(
        @Argument Integer page,
        @Argument Integer size,
        @Argument TheoryStatus status,
        @Argument String keyword,
        @Argument Boolean hot
    ) {
        return theoryService.getTheories(
            page != null ? page : 0,
            size != null ? size : 10,
            status,
            keyword,
            hot
        );
    }
    
    @QueryMapping
    public Theory theory(@Argument Long id) {
        return theoryService.getTheoryById(id).orElse(null);
    }
    
    @QueryMapping
    public User user(@Argument Long id) {
        return userService.findById(id).orElse(null);
    }
    
    @QueryMapping
    public List<Theory> userTheories(@Argument Long userId) {
        return theoryService.getTheoriesByUserId(userId);
    }
    
    @QueryMapping
    public User me(@ContextValue("userId") Long userId) {
        if (userId == null) {
            return null;
        }
        return userService.findById(userId).orElse(null);
    }
}
