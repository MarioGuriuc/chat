package com.conspiracy.forum.resolver;

import com.conspiracy.forum.dto.AuthPayload;
import com.conspiracy.forum.dto.CommentInput;
import com.conspiracy.forum.dto.TheoryInput;
import com.conspiracy.forum.model.Comment;
import com.conspiracy.forum.model.Theory;
import com.conspiracy.forum.model.User;
import com.conspiracy.forum.service.CommentService;
import com.conspiracy.forum.service.TheoryService;
import com.conspiracy.forum.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.ContextValue;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class MutationResolver {
    private final UserService userService;
    private final TheoryService theoryService;
    private final CommentService commentService;
    
    @MutationMapping
    public AuthPayload login(
        @Argument String username,
        @Argument String secretCode
    ) {
        return userService.login(username, secretCode);
    }
    
    @MutationMapping
    public AuthPayload register(
        @Argument String username,
        @Argument String secretCode,
        @Argument Boolean anonymous
    ) {
        return userService.register(username, secretCode, anonymous);
    }
    
    @MutationMapping
    public Theory createTheory(
        @Argument TheoryInput input,
        @ContextValue("userId") Long userId
    ) {
        if (userId == null) {
            throw new RuntimeException("Authentication required");
        }
        User user = userService.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return theoryService.createTheory(input, user);
    }
    
    @MutationMapping
    public Theory updateTheory(
        @Argument Long id,
        @Argument TheoryInput input,
        @ContextValue("userId") Long userId
    ) {
        if (userId == null) {
            throw new RuntimeException("Authentication required");
        }
        return theoryService.updateTheory(id, input, userId);
    }
    
    @MutationMapping
    public Boolean deleteTheory(
        @Argument Long id,
        @ContextValue("userId") Long userId
    ) {
        if (userId == null) {
            throw new RuntimeException("Authentication required");
        }
        return theoryService.deleteTheory(id, userId);
    }
    
    @MutationMapping
    public Comment createComment(
        @Argument CommentInput input,
        @ContextValue("userId") Long userId
    ) {
        if (userId == null) {
            throw new RuntimeException("Authentication required");
        }
        User user = userService.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return commentService.createComment(input, user);
    }
    
    @MutationMapping
    public Comment updateComment(
        @Argument Long id,
        @Argument String content,
        @ContextValue("userId") Long userId
    ) {
        if (userId == null) {
            throw new RuntimeException("Authentication required");
        }
        return commentService.updateComment(id, content, userId);
    }
    
    @MutationMapping
    public Boolean deleteComment(
        @Argument Long id,
        @ContextValue("userId") Long userId
    ) {
        if (userId == null) {
            throw new RuntimeException("Authentication required");
        }
        return commentService.deleteComment(id, userId);
    }
}
