package com.conspiracy.forum.model;

import jakarta.validation.constraints.NotBlank;

public record User(
        String id,
        @NotBlank String username
) {
}
