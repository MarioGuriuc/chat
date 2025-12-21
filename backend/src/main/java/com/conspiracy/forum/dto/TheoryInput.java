package com.conspiracy.forum.dto;

import com.conspiracy.forum.model.TheoryStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TheoryInput {
    @NotBlank(message = "Title is required")
    @Size(min = 5, message = "Title must be at least 5 characters")
    private String title;
    
    @NotBlank(message = "Content is required")
    @Size(min = 10, message = "Content must be at least 10 characters")
    private String content;
    
    private TheoryStatus status;
    
    private List<String> evidenceUrls = new ArrayList<>();
}
