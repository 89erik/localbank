class ApiException(Exception):
    pass
        
class Forbidden(ApiException):
    def __init__(self, message):
        self.message = message
        self.status_code = 403

class NotFound(ApiException):
    def __init__(self, message):
        self.message = message
        self.status_code = 404

class BadRequest(ApiException):
    def __init__(self, message):
        self.message = message
        self.status_code = 400