---
title: Essays
permalink: "/essay/"
layout: page
description: Thoughts about the journey from developer to adult.
---

Those are my ~~attempts at~~ collection of thought pieces from my journey so far. Maybe a better word for it would be pieces of thoughts, though. 

The opinions here are my own.

<ul>
  {% for post in site.categories.essay %}
  {% if post.type == "post" %}
    <li>
        <span>{{ post.date | date_to_string }}</span> » <a href="{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a> | <span style="font-style: italic"> {{post.description}} </span>
        <meta name="description" content="{{ post.summary | escape }}">
        <meta name="keywords" content="{{ post.tags | join: ', ' | escape }}"/>
    </li>
  {% endif %}
  {% endfor %}
</ul>