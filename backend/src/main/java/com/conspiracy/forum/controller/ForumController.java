package com.conspiracy.forum.controller;

import com.conspiracy.forum.model.AuthPayload;
import com.conspiracy.forum.model.Comment;
import com.conspiracy.forum.model.Status;
import com.conspiracy.forum.model.Theory;
import com.conspiracy.forum.model.TheoryPage;
import com.conspiracy.forum.model.User;
import com.conspiracy.forum.service.TheoryService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;

import java.util.List;
import java.util.Map;

@Controller
@Validated
public class ForumController {

    private final TheoryService theoryService;

    public ForumController(TheoryService theoryService) {
        this.theoryService = theoryService;
    }

    @QueryMapping
    public TheoryPage theories(@Argument Integer page,
                               @Argument Integer size,
                               @Argument Status status,
                               @Argument String keyword,
                               @Argument Boolean hot) {
        List<Theory> content = theoryService.listTheories(page, size, status, keyword, hot);
        int totalElements = theoryService.countTheories(status, keyword, hot);
        int resolvedPage = page == null ? 0 : Math.max(page, 0);
        int resolvedSize = size == null || size <= 0 ? 10 : size;
        int totalPages = (int) Math.ceil((double) totalElements / resolvedSize);
        return new TheoryPage(content, totalElements, totalPages, resolvedPage, resolvedSize);
    }

    @QueryMapping
    public Theory theory(@Argument String id) {
        return theoryService.getTheory(id);
    }

    @QueryMapping
    public List<Theory> userTheories(@Argument String userId) {
        return theoryService.findByUser(userId);
    }

    @MutationMapping
    public AuthPayload login(@Argument @NotBlank String username, @Argument @NotBlank String secretCode) {
        User user = theoryService.registerUser(username, secretCode);
        String token = "token-" + user.id();
        return new AuthPayload(token, user);
    }

    @MutationMapping
    public Theory addTheory(@Argument @Valid TheoryInput input) {
        User user = theoryService.findUser(input.userId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + input.userId()));
        validateTheoryLength(input.title(), input.content());
        return theoryService.addTheory(input.title(), input.content(), input.status(), user, input.evidenceUrls(), Boolean.TRUE.equals(input.anonymous()));
    }

    @MutationMapping
    public Theory updateTheory(@Argument @Valid TheoryUpdateInput input) {
        validateOptionalLength(input.title(), input.content());
        return theoryService.updateTheory(input.id(), input.title(), input.content(), input.status(), input.evidenceUrls(), input.anonymous());
    }

    @MutationMapping
    public boolean deleteTheory(@Argument String id) {
        return theoryService.deleteTheory(id);
    }

    @MutationMapping
    public Comment addComment(@Argument @Valid CommentInput input) {
        User user = theoryService.findUser(input.userId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + input.userId()));
        validateCommentLength(input.content());
        return theoryService.addComment(input.theoryId(), user, input.content(), Boolean.TRUE.equals(input.anonymous()));
    }

    @MutationMapping
    public Comment updateComment(@Argument @Valid CommentUpdateInput input) {
        validateCommentLength(input.content());
        return theoryService.updateComment(input.id(), input.content());
    }

    @MutationMapping
    public boolean deleteComment(@Argument String id) {
        return theoryService.deleteComment(id);
    }

    private void validateTheoryLength(String title, String content) {
        if (title == null || title.length() < 3) {
            throw new IllegalArgumentException("Theory title is too short to be credible.");
        }
        if (content == null || content.length() < 10) {
            throw new IllegalArgumentException("Theory content must be longer to convince fellow agents.");
        }
    }

    private void validateOptionalLength(String title, String content) {
        if (title != null && title.length() < 3) {
            throw new IllegalArgumentException("Updated title is too short.");
        }
        if (content != null && content.length() < 10) {
            throw new IllegalArgumentException("Updated content is too short.");
        }
    }

    private void validateCommentLength(String content) {
        if (content == null || content.length() < 3) {
            throw new IllegalArgumentException("Comment must add more than a whisper.");
        }
    }

    public record TheoryInput(@NotBlank String title,
                              @NotBlank String content,
                              Status status,
                              @NotBlank String userId,
                              List<String> evidenceUrls,
                              Boolean anonymous) {
    }

    public record TheoryUpdateInput(@NotBlank String id,
                                    String title,
                                    String content,
                                    Status status,
                                    List<String> evidenceUrls,
                                    Boolean anonymous) {
    }

    public record CommentInput(@NotBlank String theoryId,
                               @NotBlank String content,
                               @NotBlank String userId,
                               Boolean anonymous) {
    }

    public record CommentUpdateInput(@NotBlank String id,
                                     @Size(min = 3, message = "Updated comment must have substance") String content) {
    }
}
