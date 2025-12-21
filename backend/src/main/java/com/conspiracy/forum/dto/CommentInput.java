package com.conspiracy.forum.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentInput {
    @NotNull(message = "Theory ID is required")
    private Long theoryId;
    
    @NotBlank(message = "Content is required")
    @Size(min = 3, message = "Comment must be at least 3 characters")
    private String content;
}
