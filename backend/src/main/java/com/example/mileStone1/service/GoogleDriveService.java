package com.example.mileStone1.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.auth.http.HttpCredentialsAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.util.Collections;

@Service
public class GoogleDriveService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleDriveService.class);
    private static final String APPLICATION_NAME = "BudgetWise-Backup";

    @Value("${google.drive.client.id}")
    private String clientId;

    @Value("${google.drive.client.secret}")
    private String clientSecret;

    @Value("${google.drive.refresh.token}")
    private String refreshToken;

    @Value("${google.drive.folder.id}")
    private String folderId;

    private Drive getDriveService() throws Exception {
        if (clientId == null || clientId.isEmpty() || clientId.equals("YOUR_CLIENT_ID") || clientId.equals("PASTE_CLIENT_ID_HERE")) {
            throw new IllegalArgumentException("Google Drive Client ID not configured. Please add it to application.properties");
        }

        com.google.auth.oauth2.UserCredentials credentials = com.google.auth.oauth2.UserCredentials.newBuilder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setRefreshToken(refreshToken)
                .build();

        return new Drive.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance(),
                new HttpCredentialsAdapter(credentials))
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    public String uploadFile(String fileName, String contentType, byte[] data) throws Exception {
        String finalFolderId = extractFolderId(folderId);
        
        if (finalFolderId == null || finalFolderId.isEmpty() || finalFolderId.equals("YOUR_FOLDER_ID_HERE")) {
            throw new IllegalArgumentException("Google Drive Folder ID not configured in application.properties");
        }

        try {
            Drive service = getDriveService();

            File fileMetadata = new File();
            fileMetadata.setName(fileName);
            fileMetadata.setParents(Collections.singletonList(finalFolderId));

            com.google.api.client.http.InputStreamContent mediaContent =
                    new com.google.api.client.http.InputStreamContent(contentType, new ByteArrayInputStream(data));

            File file = service.files().create(fileMetadata, mediaContent)
                    .setSupportsAllDrives(true)
                    .setFields("id")
                    .execute();
            
            logger.info("File ID: {} uploaded successfully to Google Drive.", file.getId());
            return file.getId();
        } catch (Exception e) {
            logger.error("Error uploading file to Google Drive: {}", e.getMessage());
            throw e;
        }
    }

    public void checkFolderAccess() throws Exception {
        String finalFolderId = extractFolderId(folderId);
        if (finalFolderId == null || finalFolderId.isEmpty() || finalFolderId.equals("YOUR_FOLDER_ID_HERE")) {
            throw new IllegalArgumentException("Google Drive Folder ID not configured in application.properties");
        }

        try {
            Drive service = getDriveService();
            service.files().get(finalFolderId).setSupportsAllDrives(true).setFields("id, name, capabilities").execute();
            logger.info("Connectivity check: Folder '{}' is accessible.", finalFolderId);
        } catch (Exception e) {
            logger.error("Connectivity check failed: {}", e.getMessage());
            throw e;
        }
    }

    private String extractFolderId(String input) {
        if (input == null || input.isEmpty() || input.equalsIgnoreCase("root")) return "root";
        if (input.contains("/folders/")) {
            String[] parts = input.split("/folders/");
            String rest = parts[parts.length - 1];
            return rest.split("\\?")[0].split("/")[0];
        }
        return input;
    }
}
