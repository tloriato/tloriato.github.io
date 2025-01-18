---
title: Research
permalink: "/research/"
layout: page
description: Thoughts about the journey from developer to adult.
---

Those are my ~~attempts at~~ collection of research pieces and longer form thoughts. Here you'll find deeper dives into topics that require more thorough exploration and analysis.

The opinions here are my own.

<ul>
  {% for post in site.categories.research %}
  {% if post.type == "post" %}
    <li>
        <span>{{ post.date | date_to_string }}</span> » <a href="{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a> | <span style="font-style: italic"> {{post.description}} </span>
        <meta name="description" content="{{ post.summary | escape }}">
        <meta name="keywords" content="{{ post.tags | join: ', ' | escape }}"/>
    </li>
  {% endif %}
  {% endfor %}
</ul>