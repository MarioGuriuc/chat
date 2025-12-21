package com.conspiracy.forum.dto;

import com.conspiracy.forum.model.Theory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TheoryPage {
    private List<Theory> content;
    private Integer totalElements;
    private Integer totalPages;
    private Integer currentPage;
    private Integer size;
}
