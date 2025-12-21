package com.conspiracy.forum.model;

import java.time.Instant;

import jakarta.validation.constraints.NotBlank;

public record Comment(
        String id,
        String theoryId,
        User author,
        @NotBlank String content,
        Instant postedAt,
        boolean anonymous
) {
    public String displayAuthor() {
        return anonymous ? "Anonymous Agent" : author.username();
    }
}
