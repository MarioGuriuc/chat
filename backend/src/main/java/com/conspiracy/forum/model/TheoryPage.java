package com.conspiracy.forum.model;

import java.util.List;

public record TheoryPage(List<Theory> content, int totalElements, int totalPages, int page, int size) {
}
