FROM nginx:alpine

# Copy all files from the current directory to /usr/share/nginx/html
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
