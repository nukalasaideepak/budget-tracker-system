package com.comparekaro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class CompareKaroApplication {

    public static void main(String[] args) {
        SpringApplication.run(CompareKaroApplication.class, args);
    }
}
