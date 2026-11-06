package com.blackcat.text.repository

import com.blackcat.text.entity.MessageEntity
import org.springframework.data.jpa.repository.JpaRepository

interface MessageRepository : JpaRepository<MessageEntity, Long> {
    // Lấy toàn bộ tin nhắn, sắp xếp theo thời gian tăng dần (cũ -> mới)
    fun findAllByOrderByCreatedAtAsc(): List<MessageEntity>
}