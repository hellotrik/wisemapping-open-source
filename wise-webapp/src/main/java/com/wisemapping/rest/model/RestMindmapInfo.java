package com.wisemapping.rest.model;


import com.wisemapping.model.MindMap;
import com.wisemapping.model.User;
import org.codehaus.jackson.annotate.*;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

@XmlRootElement(name = "map")
@XmlAccessorType(XmlAccessType.PROPERTY)
@JsonAutoDetect(
        fieldVisibility = JsonAutoDetect.Visibility.NONE,
        setterVisibility = JsonAutoDetect.Visibility.PUBLIC_ONLY,
        isGetterVisibility = JsonAutoDetect.Visibility.NONE,
        getterVisibility = JsonAutoDetect.Visibility.PUBLIC_ONLY
)
@JsonIgnoreProperties(ignoreUnknown = true)
public class RestMindmapInfo {

    @JsonIgnore
    private MindMap mindmap;
    @JsonIgnore
    static private SimpleDateFormat sdf;

    static {
        sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
    }

    public RestMindmapInfo() {
        this(new MindMap());

    }

    public RestMindmapInfo(@NotNull MindMap mindmap) {
        this.mindmap = mindmap;
    }

    public String getCreationTime() {
        return this.toISO8601(mindmap.getCreationTime().getTime());
    }

    public String getDescription() {
        return mindmap.getDescription();
    }

    public String getTags() {
        return mindmap.getTags();
    }

    public String getTitle() {
        return mindmap.getTitle();
    }

    public int getId() {
        return mindmap.getId();
    }

    public String getCreator() {
        return mindmap.getCreator();
    }

    public String getLastModifierUser() {
        return mindmap.getLastModifierUser();
    }

    public String getLastModificationTime() {
        final Calendar calendar = mindmap.getLastModificationTime();
        return this.toISO8601(calendar.getTime());
    }

    public boolean isPublic() {
        return mindmap.isPublic();
    }

    public void setId(int id) {
        mindmap.setId(id);
    }

    public void setTitle(String title) {
        mindmap.setTitle(title);
    }

    public void setTags(String tags) {
        mindmap.setTags(tags);
    }

    public void setDescription(String description) {
        mindmap.setDescription(description);
    }

    public void setCreator(String creatorUser) {

    }

    public void setLastModificationTime(String value) {
    }

    public void setLastModifierUser(String value) {
    }

    @JsonIgnore
    public MindMap getDelegated() {
        return this.mindmap;
    }

    private String toISO8601(@NotNull Date date) {
        return sdf.format(date) + "Z";
    }
}