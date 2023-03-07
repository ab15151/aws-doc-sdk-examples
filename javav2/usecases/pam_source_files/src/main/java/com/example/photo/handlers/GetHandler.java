package com.example.photo.handlers;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.example.photo.WorkCount;
import com.example.photo.services.DynamoDBService;
import com.google.gson.Gson;

import java.util.Map;
import java.util.TreeMap;

public class GetHandler implements RequestHandler<Object, String> {
    @Override
    public String handleRequest(Object o, Context context) {
        DynamoDBService dbService = new DynamoDBService();
        Map<String, WorkCount> map = dbService.scanPhotoTable();
        Gson gson = new Gson();
        Map<String, Map> m = new TreeMap<>();
        m.put("labels", map);
        return gson.toJson(m);
    }
}
