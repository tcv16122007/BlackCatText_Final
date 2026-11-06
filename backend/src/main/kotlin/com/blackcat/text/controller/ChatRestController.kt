package com.blackcat.text.controller

import com.blackcat.text.entity.ChatMessage
import com.blackcat.text.repository.MessageRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/chat")
class ChatRestController(private val messageRepository: MessageRepository) {

    @GetMapping("/history")
    fun getHistory(): List<ChatMessage> {
        return messageRepository.findAllByOrderByCreatedAtAsc().map {
            ChatMessage(sender = it.sender, content = it.content)
        }
    }
}